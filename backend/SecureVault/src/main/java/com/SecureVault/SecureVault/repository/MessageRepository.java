package com.SecureVault.SecureVault.repository;

import com.SecureVault.SecureVault.entity.Message;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query(
        "SELECT m FROM Message m WHERE "
            + "(m.senderId = :a AND m.recipientId = :b) OR "
            + "(m.senderId = :b AND m.recipientId = :a) "
            + "ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("a") Long a, @Param("b") Long b);
}
