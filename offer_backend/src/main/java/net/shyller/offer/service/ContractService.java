package net.shyller.offer.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.db.domain.Contract;
import net.shyller.offer.db.domain.Object;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.db.repository.ContractRepository;
import net.shyller.offer.dto.ContractDto;
import net.shyller.offer.dto.ObjectDto;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final ObjectService objectService;
    private final ModelMapper modelMapper;
    private final CustomUserDetailsService customUserDetailsService;

    @Value("${file.storage}")
    private String uploadDir;

    @Value("${file.max-size}")
    private Long maxFileSize;

    @Transactional
    public ContractDto create(ContractDto dto, HttpServletRequest request) {
        UUID objectId = dto.getObjectDto().getId();
        Object object = objectService.getById(objectId);

        if (object.getContract() != null) {
            throw new IllegalStateException("Для данного объекта уже существует контракт");
        }

        Contract contract = modelMapper.map(dto, Contract.class);
        contract.setObject(object);
        contract.setSignedAt(OffsetDateTime.now());
        contract.setIp(request.getRemoteAddr());
        contract.setUserAgent(request.getHeader("User-Agent"));

        Contract saved = contractRepository.save(contract);
        return modelMapper.map(saved, ContractDto.class);
    }

    @Transactional(readOnly = true)
    public List<ContractDto> getAllByObjectOwner() {
        User currentUser = customUserDetailsService.getCurrentUser();

        List<Contract> contracts = contractRepository.findAllByObjectOwner(currentUser);

        return contracts.stream()
                .map(contract -> {
                    ContractDto dto = modelMapper.map(contract, ContractDto.class);

                    // вручную замапить object, но убрать contract у object
                    Object object = contract.getObject();
                    ObjectDto objectDto = modelMapper.map(object, ObjectDto.class);
                    objectDto.setContract(null); // отключаем зацикливание

                    dto.setObjectDto(objectDto);
                    return dto;
                })
                .toList();
    }

    public String upload(MultipartFile file) {
        final long fileSize = file.getSize();
        final boolean isLargeFile = fileSize >= maxFileSize;

        if (isLargeFile) {
            throw new IllegalArgumentException("Файл слишком большой. Максимум: " + maxFileSize + " байт");
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Пустой файл не может быть загружен");
        }

        final String originalFilename = file.getOriginalFilename();
        final String extension = Optional.ofNullable(originalFilename)
                .filter(f -> f.contains("."))
                .map(f -> f.substring(originalFilename.lastIndexOf('.') + 1))
                .orElse("bin");

        final String filename = UUID.randomUUID() + "." + extension;
        final Path destinationPath = Paths.get(uploadDir).resolve(filename);

        try {
            Files.createDirectories(destinationPath.getParent());
            file.transferTo(destinationPath);
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при сохранении файла", e);
        }

        return String.format("storage/images/%s", filename);
    }

    public byte[] loadDocumentPhoto(UUID contractId) {
        Contract contract =
            contractRepository
                .findById(contractId)
                .orElseThrow(() -> new EntityNotFoundException("Контракт не найден"));

        String path = contract.getDocumentPhotoUrl();
        if (path == null) {
            throw new IllegalStateException("Фото не прикреплено к контракту");
        }

        try {
            return Files.readAllBytes(Paths.get(path));
        } catch (IOException e) {
            throw new RuntimeException("Не удалось прочитать фото", e);
        }
    }

}
