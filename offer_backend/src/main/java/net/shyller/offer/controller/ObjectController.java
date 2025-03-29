package net.shyller.offer.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.dto.ObjectDto;
import net.shyller.offer.dto.UserDto;
import net.shyller.offer.dto.ValidationErrorResponseDto;
import net.shyller.offer.service.ObjectService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/objects")
@SecurityRequirement(name = "JWT")
@Tag(name = "Контроллер объектов", description = "Обслуживает запрос объектов")
public class ObjectController {
    private final ObjectService service;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PAID_USER')")
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Получение всех объектов пользователя")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Получены объекта",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ObjectDto.class))
                            )
                    }
            )
    })
    public List<ObjectDto> getAll() {
        return service.getAll();
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PAID_USER')")
    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Получение объекта по id")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Получены объекта",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ObjectDto.class))
                            )
                    }
            )
    })
    public ObjectDto get( @PathVariable("id") @Parameter(description = "Идентификатор объекта", required = true) UUID id) {
        return service.findById(id);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PAID_USER')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создание нового объекта")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Объект успешно создан",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ObjectDto.class)
                            )
                    }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Ошибка в теле запроса",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ValidationErrorResponseDto.class))
                            )
                    }
            )
    })
    public ObjectDto create(@Valid @RequestBody ObjectDto objectDto) {
        return service.create(objectDto);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PAID_USER')")
    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Обновление существующего объекта")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Объект успешно обновлен",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ObjectDto.class)
                            )
                    }
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Ошибка в теле запроса",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = ValidationErrorResponseDto.class))
                            )
                    }
            )
    })
    public ObjectDto update(
            @PathVariable("id") @Parameter(description = "Идентификатор объекта", required = true) UUID id,
            @Valid @RequestBody ObjectDto objectDto) {
        return service.update(id, objectDto);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PAID_USER')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @Operation(summary = "Удаление существующего объекта")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "202",
                    description = "Объект успешно удален"
            )
    })
    public void delete(@PathVariable("id") @Parameter(description = "Идентификатор объекта", required = true) UUID id) {
        service.delete(id);
    }
}
