package com.javaforge.auth.progress;

import com.javaforge.auth.progress.dto.DashboardResponse;
import com.javaforge.auth.progress.dto.RecordLearningActivityRequest;
import com.javaforge.auth.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/progress")
public class ProgressController {

    private final LearningProgressService learningProgressService;

    public ProgressController(LearningProgressService learningProgressService) {
        this.learningProgressService = learningProgressService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse getDashboard(@AuthenticationPrincipal AuthenticatedUser user) {
        return learningProgressService.getDashboard(user);
    }

    @PostMapping("/activity")
    public DashboardResponse recordActivity(
        @AuthenticationPrincipal AuthenticatedUser user,
        @Valid @RequestBody RecordLearningActivityRequest request
    ) {
        return learningProgressService.recordActivity(user, request);
    }
}
