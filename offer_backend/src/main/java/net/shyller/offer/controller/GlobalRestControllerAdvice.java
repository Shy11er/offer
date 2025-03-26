package net.shyller.offer.controller;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import java.util.stream.Collectors;

import net.shyller.offer.dto.ExceptionResponseDto;
import net.shyller.offer.dto.ValidationErrorResponseDto;
import net.shyller.offer.dto.Violation;
import net.shyller.offer.exception.AlreadyExistsException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

@RestControllerAdvice
public class GlobalRestControllerAdvice {
    private static final Logger logger = LoggerFactory.getLogger(GlobalRestControllerAdvice.class);

    @ExceptionHandler({
            EntityNotFoundException.class,
            UsernameNotFoundException.class,
    })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionResponseDto handleNotFoundException(Exception e) {
        return getExceptionResponseDto(e);
    }

    @ExceptionHandler({
            AlreadyExistsException.class,
    })
    @ResponseStatus(HttpStatus.CONFLICT)
    public ExceptionResponseDto handleConflict(Exception e) {
        return getExceptionResponseDto(e);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponseDto handleConstraintViolationException(ConstraintViolationException e) {
        return new ValidationErrorResponseDto(
                e.getConstraintViolations().stream().map(
                        violation -> new Violation(
                                violation.getPropertyPath().toString(),
                                violation.getMessage()
                        )
                ).collect(Collectors.toList())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ValidationErrorResponseDto handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return new ValidationErrorResponseDto(
                e.getBindingResult().getFieldErrors().stream()
                        .map(error -> new Violation(error.getField(), error.getDefaultMessage()))
                        .collect(Collectors.toList())
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponseDto handleInvalidDateFormat(HttpMessageNotReadableException ex) {
        if (ex.getCause() instanceof InvalidFormatException cause) {
            return new ExceptionResponseDto(
                    String.format("%s: Failed to parse date", cause.getPath().getFirst().getFieldName()));
        }

        return getExceptionResponseDto(ex);
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            MethodArgumentTypeMismatchException.class,
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponseDto handleBadRequest(Exception ex) {
        return getExceptionResponseDto(ex);
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ExceptionResponseDto handleAccessDeniedException(AccessDeniedException ex) {
        return getExceptionResponseDto(ex);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionResponseDto handleNoHandlerFoundException(NoHandlerFoundException ex) {
        return getExceptionResponseDto(ex);
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ExceptionResponseDto handleAuthenticationException(AuthenticationException ex) {
        return getExceptionResponseDto(ex);
    }

    @ExceptionHandler(AuthenticationCredentialsNotFoundException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ExceptionResponseDto handleGoneException(AuthenticationCredentialsNotFoundException ex) {
        return getExceptionResponseDto(ex);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionResponseDto handleGeneralException(Exception ex) {
        ExceptionResponseDto response = getExceptionResponseDto(ex);
        response.setMessage("Возникла ошибка во время обработки запроса.");
        return response;
    }

    private ExceptionResponseDto getExceptionResponseDto(Exception e) {
        logger.error(e.getMessage(), e);
        ExceptionResponseDto response = new ExceptionResponseDto();
        response.setMessage(e.getMessage());
        return response;
    }
}
