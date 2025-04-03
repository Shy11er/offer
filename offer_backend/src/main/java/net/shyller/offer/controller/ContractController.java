package net.shyller.offer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.dto.ContractDto;
import net.shyller.offer.service.ContractService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static org.springframework.http.HttpStatus.OK;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/contracts")
@SecurityRequirement(name = "JWT")
@PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PAID_USER')")
@Tag(name = "Контроллер контрактов", description = "Обслуживает запрос контрактов")
public class ContractController {

    private final ContractService contractService;

    @Operation(summary = "Создание контракта")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Контракты созданы успешно"
            )
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContractDto create(@RequestBody ContractDto contractDto, HttpServletRequest request) {
        return contractService.create(contractDto, request);
    }

    @Operation(summary = "Получение контрактов текущего пользователя")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Контракты получены успешно"
            )
    })
    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<ContractDto> getAll() {
        return contractService.getAllByObjectOwner();
    }

    @Operation(summary = "Загрузка паспорта или водительских прав")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Успешно загружено"
            )
    })
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    @ResponseStatus(OK)
    public String upload(@RequestParam("file") MultipartFile file) {
        return contractService.upload(file);
    }

    @Operation(summary = "Загрузка паспорта или водительских прав")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Успешно загружено")
    })
    @GetMapping("/{id}/document-photo")
    @ResponseStatus(HttpStatus.OK)
    public void getDocumentPhoto(@PathVariable UUID id, HttpServletResponse response) {
        byte[] photoBytes = contractService.loadDocumentPhoto(id);

        response.setContentType("image/jpeg");
        response.setContentLength(photoBytes.length);

        try {
            response.getOutputStream().write(photoBytes);
            response.flushBuffer();
        } catch (IOException e) {
            throw new RuntimeException("Ошибка при отправке фото", e);
        }
    }

}
