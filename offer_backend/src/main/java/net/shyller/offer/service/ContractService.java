package net.shyller.offer.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.db.domain.Contract;
import net.shyller.offer.db.domain.Object;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.db.repository.ContractRepository;
import net.shyller.offer.dto.ContractDto;
import net.shyller.offer.dto.ObjectDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;
    private final ObjectService objectService;
    private final ModelMapper modelMapper;
    private final CustomUserDetailsService customUserDetailsService;

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

}
