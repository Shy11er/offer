package net.shyller.offer.service;

import jakarta.persistence.EntityNotFoundException;
import java.util.*;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import net.shyller.offer.db.domain.Object;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.db.repository.ObjectRepository;
import net.shyller.offer.dto.ObjectDto;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ObjectService {
    private final ObjectRepository objectRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final ModelMapper mapper;
    private final ModelMapper modelMapper;

    @Transactional
    public List<ObjectDto> getAll() {
        User currentUser = customUserDetailsService.getCurrentUser();

        return objectRepository.findAllByOwnerId(currentUser.getId())
                .stream()
                .map(object -> mapper.map(object, ObjectDto.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public ObjectDto findById(UUID id) {
        return modelMapper.map(getById(id), ObjectDto.class);
    }

    @Transactional
    public ObjectDto create(ObjectDto inDto) {
        User currentUser = customUserDetailsService.getCurrentUser();
        Object object = mapper.map(inDto, Object.class);

        object.setOwner(currentUser);
        return mapper.map(objectRepository.save(object), ObjectDto.class);
    }

    @Transactional
    public ObjectDto update(UUID id, ObjectDto inDto) {
        Object object = getById(id);

        mapper.map(inDto, object);

        return mapper.map(objectRepository.save(object), ObjectDto.class);
    }

    @Transactional
    public void delete(UUID id) {
        Object object = getById(id);
        objectRepository.delete(object);
    }

    private Object getById(UUID id) {
        return objectRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(String.format("Пользователь с id %s не найден", id)));
    }
}
