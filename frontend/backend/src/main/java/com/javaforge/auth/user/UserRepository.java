package com.javaforge.auth.user;

import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @Query("""
        select u
        from UserEntity u
        where u.status = :status
          and (lower(u.username) = lower(:identifier) or lower(u.email) = lower(:identifier))
        """)
    Optional<UserEntity> findByIdentifierAndStatus(
        @Param("identifier") String identifier,
        @Param("status") UserStatus status
    );

    @Query("""
        select count(u)
        from UserEntity u
        where lower(u.username) = lower(:username)
           or lower(u.email) = lower(:email)
        """)
    long countConflicts(@Param("username") String username, @Param("email") String email);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        update UserEntity u
        set u.lastLoginAt = :lastLoginAt
        where u.id = :userId
        """)
    int updateLastLoginAt(@Param("userId") Long userId, @Param("lastLoginAt") LocalDateTime lastLoginAt);
}
