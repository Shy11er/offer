package net.shyller.offer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import java.util.List;

import lombok.RequiredArgsConstructor;
import net.shyller.offer.dto.ContractDto;
import net.shyller.offer.service.ContractService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
        contractDto.setSignedAt(OffsetDateTime.now());
        contractDto.setIp(request.getRemoteAddr());
        contractDto.setUserAgent(request.getHeader("User-Agent"));
        return contractService.create(contractDto);
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
}
