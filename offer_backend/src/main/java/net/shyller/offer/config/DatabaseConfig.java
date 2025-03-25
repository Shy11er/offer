package net.shyller.offer.config;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableAutoConfiguration
@EntityScan(basePackages = {"net.shyller.offer.db.domain"})
@EnableJpaRepositories(basePackages = {"net.shyller.offer.db.repository"})
@EnableTransactionManagement
public class DatabaseConfig { }
