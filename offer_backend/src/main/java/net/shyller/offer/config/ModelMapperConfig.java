package net.shyller.offer.config;

import net.shyller.offer.common.RoleName;
import net.shyller.offer.db.domain.Role;
import net.shyller.offer.db.domain.User;
import net.shyller.offer.dto.UserDto;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

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

        return modelMapper;
    }
}
