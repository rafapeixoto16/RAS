import { defineStore } from 'pinia';
import { getProjects } from '@/api/queries/getProjects';
import { getProject } from '@/api/queries/getProject';
import { createProject } from '@/api/mutations/createProject';
import { updateProject } from '@/api/mutations/updateProject';
import { deleteProject } from '@/api/mutations/deleteProject';
import { getImage } from '@/api/queries/getImage';
import { addImage } from '@/api/mutations/addImage';
import { reorderImage } from '@/api/mutations/reorderImage';
import { removeImage } from '@/api/mutations/removeImage';
import { type Project } from '@/types/project';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

export const useProjectStore = defineStore('projectStore', {
  state: (): ProjectState => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProjects() {
      this.loading = true;
      try {
        this.projects = await getProjects();
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while fetching projects';
      } finally {
        this.loading = false;
      }
    },

    async fetchProject(projectId: number) {
      this.loading = true;
      try {
        this.currentProject = await getProject(projectId);
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while fetching the project';
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData: { name: string }) {
      this.loading = true;
      try {
        const newProject = await createProject(projectData);
        this.projects.unshift(newProject);
        return newProject;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while creating the project';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(projectId: number, projectData: { name: string }) {
      this.loading = true;
      try {
        const updatedProject = await updateProject(projectId, projectData);
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index !== -1) {
          this.projects[index] = updatedProject;
        }
        if (this.currentProject && this.currentProject.id === projectId) {
          this.currentProject = updatedProject;
        }
        return updatedProject;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while updating the project';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProject(projectId: number) {
      this.loading = true;
      try {
        await deleteProject(projectId);
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.currentProject && this.currentProject.id === projectId) {
          this.currentProject = null;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while deleting the project';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getProjectImage(projectId: number, imageIndex: number) {
      this.loading = true;
      try {
        const imageUrl = await getImage(projectId, imageIndex);
        return imageUrl;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while fetching the image';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addProjectImage(projectId: number, imageFile: File) {
      this.loading = true;
      try {
        const { index, imageUrl } = await addImage(projectId, imageFile);
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
          project.images.push({ id: index.toString(), format: imageFile.type.split('/')[1] });
        }
        if (this.currentProject && this.currentProject.id === projectId) {
          this.currentProject.images.push({ id: index.toString(), format: imageFile.type.split('/')[1] });
        }
        return { index, imageUrl };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while adding the image';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async reorderProjectImage(projectId: number, oldIndex: number, newIndex: number) {
      this.loading = true;
      try {
        const { reorderedImage, imageIdx } = await reorderImage(projectId, oldIndex, newIndex);
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
          const [removedImage] = project.images.splice(oldIndex, 1);
          project.images.splice(newIndex, 0, removedImage);
        }
        if (this.currentProject && this.currentProject.id === projectId) {
          const [removedImage] = this.currentProject.images.splice(oldIndex, 1);
          this.currentProject.images.splice(newIndex, 0, removedImage);
        }
        return { reorderedImage, imageIdx };
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while reordering the image';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async removeProjectImage(projectId: number, imageIndex: number) {
      this.loading = true;
      try {
        const removedImage = await removeImage(projectId, imageIndex);
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
          project.images = project.images.filter((_, index) => index !== imageIndex);
        }
        if (this.currentProject && this.currentProject.id === projectId) {
          this.currentProject.images = this.currentProject.images.filter((_, index) => index !== imageIndex);
        }
        return removedImage;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while removing the image';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },
  },

  getters: {
    getProjectById: (state) => {
      return (id: number) => state.projects.find(project => project.id === id);
    },
  },
});