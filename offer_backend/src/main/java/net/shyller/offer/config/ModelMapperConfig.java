package net.shyller.offer.config;

import net.shyller.offer.common.RoleName;
import net.shyller.offer.db.domain.*;
import net.shyller.offer.db.domain.Object;
import net.shyller.offer.dto.ContractDto;
import net.shyller.offer.dto.ObjectDto;
import net.shyller.offer.dto.PenaltyDto;
import net.shyller.offer.dto.UserDto;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.getConfiguration().setFieldMatchingEnabled(true);
        modelMapper.getConfiguration().setPropertyCondition(context -> context.getSource() != null);

        modelMapper.createTypeMap(UserDto.class, User.class)
                .addMappings(mapper -> mapper.skip(User::setRoles));

        modelMapper.createTypeMap(User.class, UserDto.class)
                .addMappings(mapper -> {
                    mapper.using(ctx -> Optional.ofNullable(ctx.getSource())
                                    .map(source -> ((Set<Role>) source).stream()
                                            .map(role -> RoleName.valueOf(role.getName().name()))
                                            .toList())
                                    .orElse(Collections.emptyList()))
                            .map(User::getRoles, UserDto::setRoles);
                });

        modelMapper.createTypeMap(Object.class, ObjectDto.class)
                .addMappings(mapper -> {
                    mapper.using(ctx -> Optional.ofNullable(ctx.getSource())
                                    .map(source -> ((List<Penalty>) source).stream()
                                            .map(p -> modelMapper.map(p, PenaltyDto.class))
                                            .collect(Collectors.toList()))
                                    .orElse(Collections.emptyList()))
                            .map(Object::getPenalties, ObjectDto::setPenalties);
                });

        modelMapper.createTypeMap(Contract.class, ContractDto.class).addMappings(mapper -> {
            mapper.map(src -> src.getObject(), ContractDto::setObjectDto);
        });

        modelMapper.createTypeMap(ObjectDto.class, Object.class)
                .addMappings(mapper -> mapper.map(ObjectDto::getIsTemplate, Object::setTemplate));

        return modelMapper;
    }
}
