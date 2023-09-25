package com.incite.o360v.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.incite.o360v.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.incite.o360v.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.incite.o360v.domain.User.class.getName());
            createCache(cm, com.incite.o360v.domain.Authority.class.getName());
            createCache(cm, com.incite.o360v.domain.User.class.getName() + ".authorities");
            createCache(cm, com.incite.o360v.domain.Country.class.getName());
            createCache(cm, com.incite.o360v.domain.Country.class.getName() + ".projects");
            createCache(cm, com.incite.o360v.domain.Project.class.getName());
            createCache(cm, com.incite.o360v.domain.Project.class.getName() + ".projects");
            createCache(cm, com.incite.o360v.domain.Project.class.getName() + ".projectDates");
            createCache(cm, com.incite.o360v.domain.Project.class.getName() + ".stakeholders");
            createCache(cm, com.incite.o360v.domain.Project.class.getName() + ".projectFiles");
            createCache(cm, com.incite.o360v.domain.Project.class.getName() + ".projectComments");
            createCache(cm, com.incite.o360v.domain.Project.class.getName() + ".countries");
            createCache(cm, com.incite.o360v.domain.JiraSetUp.class.getName());
            createCache(cm, com.incite.o360v.domain.Jira.class.getName());
            createCache(cm, com.incite.o360v.domain.CostCenter.class.getName());
            createCache(cm, com.incite.o360v.domain.CostCenter.class.getName() + ".projects");
            createCache(cm, com.incite.o360v.domain.AccountNumber.class.getName());
            createCache(cm, com.incite.o360v.domain.AccountNumber.class.getName() + ".projects");
            createCache(cm, com.incite.o360v.domain.ProjectOwner.class.getName());
            createCache(cm, com.incite.o360v.domain.ProjectOwner.class.getName() + ".projects");
            createCache(cm, com.incite.o360v.domain.ProjectComment.class.getName());
            createCache(cm, com.incite.o360v.domain.ProjectFile.class.getName());
            createCache(cm, com.incite.o360v.domain.ProjectDate.class.getName());
            createCache(cm, com.incite.o360v.domain.ProjectGoal.class.getName());
            createCache(cm, com.incite.o360v.domain.ProjectGoal.class.getName() + ".projects");
            createCache(cm, com.incite.o360v.domain.Stakeholder.class.getName());
            createCache(cm, com.incite.o360v.domain.Stakeholder.class.getName() + ".stakeholderComments");
            createCache(cm, com.incite.o360v.domain.Stakeholder.class.getName() + ".users");
            createCache(cm, com.incite.o360v.domain.StakeholderComment.class.getName());
            createCache(cm, com.incite.o360v.domain.UserGroup.class.getName());
            createCache(cm, com.incite.o360v.domain.UserGroup.class.getName() + ".userGroupAccesses");
            createCache(cm, com.incite.o360v.domain.UserGroup.class.getName() + ".users");
            createCache(cm, com.incite.o360v.domain.UserGroupAccess.class.getName());
            createCache(cm, com.incite.o360v.domain.Company.class.getName());
            createCache(cm, com.incite.o360v.domain.Company.class.getName() + ".users");
            createCache(cm, com.incite.o360v.domain.Area.class.getName());
            createCache(cm, com.incite.o360v.domain.Area.class.getName() + ".brands");
            createCache(cm, com.incite.o360v.domain.Brand.class.getName());
            createCache(cm, com.incite.o360v.domain.Brand.class.getName() + ".audiences");
            createCache(cm, com.incite.o360v.domain.Audience.class.getName());
            createCache(cm, com.incite.o360v.domain.Audience.class.getName() + ".channels");
            createCache(cm, com.incite.o360v.domain.Channel.class.getName());
            createCache(cm, com.incite.o360v.domain.Channel.class.getName() + ".projects");
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
