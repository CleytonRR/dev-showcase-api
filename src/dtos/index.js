const profileDto = (profile) => ({
  id: profile.id,
  name: profile.name,
  email: profile.email,
  bio: profile.bio,
  avatarUrl: profile.avatarUrl,
  ...(profile.projects ? { projects: profile.projects.map(projectDto) } : {}),
});

const technologyDto = (technology) => ({
  id: technology.id,
  name: technology.name,
  category: technology.category,
});

const projectDto = (project) => ({
  id: project.id,
  title: project.title,
  description: project.description,
  url: project.url,
  profileId: project.profileId,
  ...(project.profile ? { profile: profileDto(project.profile) } : {}),
  ...(project.technologies
    ? { technologies: project.technologies.map(technologyDto) }
    : {}),
  ...(project.feedback ? { feedback: project.feedback.map(feedbackDto) } : {}),
});

const feedbackDto = (feedback) => ({
  id: feedback.id,
  author: feedback.author,
  content: feedback.content,
  projectId: feedback.projectId,
  createdAt: feedback.createdAt,
});

module.exports = { profileDto, technologyDto, projectDto, feedbackDto };
