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
import net.shyller.offer.dto.UserDto;
import net.shyller.offer.dto.ValidationErrorResponseDto;
import net.shyller.offer.dto.in.UserInDto;
import net.shyller.offer.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
@SecurityRequirement(name = "JWT")
@Tag(name = "Контроллер пользователей", description = "Обрабатывает любые взаимодействия с пользователями.")
public class UserController {
    private final UserService service;

    @GetMapping("/me")
    @Operation(summary = "Получение текущего пользователя")
    @ResponseStatus(HttpStatus.OK)
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Пользователь найден",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = UserDto.class))
                            )
                    }
            )
    })
    public UserDto getCurrentUser() {
        return service.getCurrentUser();
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping
    @Operation(summary = "Получение списка пользователей (с фильтрацией по email)")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Пользователи найдены",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = UserDto.class))
                            )
                    }
            )
    })
    public List<UserDto> getAll() {
        return service.getAll();
    }


    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Создание нового пользователя")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "201",
                    description = "Пользователь успешно создан",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserDto.class)
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

    public UserDto create(@Valid @RequestBody UserInDto userDto) {
        return service.create(userDto);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    @PatchMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Обновление существующего пользователя")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Пользователь успешно обновлен",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserDto.class)
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
    public UserDto updateUser(
            @PathVariable("id") @Parameter(description = "Идентификатор пользователя", required = true) UUID id,
            @Valid @RequestBody UserInDto userDto) {
        return service.update(id, userDto);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_PAID_USER')")
    @PatchMapping("/{id}/cancel-subscription")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Отмена подписки")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Подписка отменена",
                    content = {
                            @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = UserDto.class)
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
    public UserDto cancelSubscription(
            @PathVariable("id") @Parameter(description = "Идентификатор пользователя", required = true) UUID id) {
        return service.cancelSubscription(id);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    @Operation(summary = "Удаление существующего пользователя")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "202",
                    description = "Пользователь успешно удален"
            )
    })
    @SecurityRequirement(name = "JWT")
    public void deleteUser(@PathVariable("id") @Parameter(description = "Идентификатор пользователя", required = true) UUID id) {
        service.delete(id);
    }

}
