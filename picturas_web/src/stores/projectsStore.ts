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
import type { Project, FilterParameters } from '@/types/project';
import { useAuthStore } from './authStore';
import { getFiltersParemeters } from '@/api';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
  filterParameters: FilterParameters | null;
}

export const useProjectStore = defineStore('projectStore', {
  state: (): ProjectState => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    filterParameters: null,
  }),

  actions: {
    async fetchProjects() {
      this.loading = true;
      try {
        if (useAuthStore().accessToken) {
          this.projects = await getProjects(useAuthStore().accessToken ?? '');
          console.log(this.projects)
            for (const project of this.projects) {
            const imagesUrls = [];
            for (let index = 0; index < project.images.length; index++) {
              const imageUrl = await getImage(project._id, index, useAuthStore().accessToken ?? '');
              imagesUrls.push({ id: index, imageUrl });
            }
            project.images = imagesUrls;
            }
        } else {
          throw new Error('Access token is null');
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while fetching projects';
      } finally {
        this.loading = false;
      }
    },

    async fetchProject(projectId: string) {
      this.loading = true;
      try {
        this.currentProject = await getProject(projectId, useAuthStore().accessToken ?? '');
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while fetching the project';
      } finally {
        this.loading = false;
      }
    },

    async createProject(projectData: { name: string }) {
      this.loading = true;
      try {
        const newProject = await createProject(projectData, useAuthStore().accessToken ?? '');
        this.projects = [newProject, ...this.projects];
        return newProject;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while creating the project';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(projectId: string, projectData: { name: string }) {
      this.loading = true;
      try {
        await updateProject(projectId, projectData, useAuthStore().accessToken ?? '');
        await this.fetchProjects()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while updating the project';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteProject(projectId: string) {
      this.loading = true;
      try {
        await deleteProject(projectId, useAuthStore().accessToken ?? '');
        this.projects = this.projects.filter(p => p._id !== projectId);
        if (this.currentProject && this.currentProject._id === projectId) {
          this.currentProject = null;
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while deleting the project';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getProjectImage(projectId: string, imageIndex: number) {
      this.loading = true;
      try {
        const imageUrl = await getImage(projectId, imageIndex, useAuthStore().accessToken ?? '');
        return imageUrl;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while fetching the image';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async addProjectImage(projectId: string, imageFile: File) {
      this.loading = true;
      try {
        const { id, imageUrl } = await addImage(projectId, imageFile, useAuthStore().accessToken ?? '');
        const project = this.projects.find(p => p._id === projectId);
        if (project) {
          project.images.push({ id: id, imageUrl });
        }
        if (this.currentProject && this.currentProject._id === projectId) {
          this.currentProject.images.push({ id: id, imageUrl });
        }
        return { id: id, imageUrl };
      } catch (error) {
      this.error = error instanceof Error ? error.message : 'An error occurred while adding the image';
      throw error;
      } finally {
      this.loading = false;
      }
    },

    async reorderProjectImage(projectId: string, oldIndex: number, newIndex: number) {
      this.loading = true;
      try {
        const { reorderedImage, imageIdx } = await reorderImage(projectId, oldIndex, newIndex);
        const project = this.projects.find(p => p._id === projectId);
        if (project) {
          const [removedImage] = project.images.splice(oldIndex, 1);
          project.images.splice(newIndex, 0, removedImage);
        }
        if (this.currentProject && this.currentProject._id === projectId) {
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

    async removeProjectImage(projectId: string, imageIndex: number) {
      this.loading = true;
      try {
        const removedImage = await removeImage(projectId, imageIndex);
        const project = this.projects.find(p => p._id === projectId);
        if (project) {
          project.images = project.images.filter((_, index) => index !== imageIndex);
        }
        if (this.currentProject && this.currentProject._id === projectId) {
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

    async fetchFilterParameters() {
      this.loading = true;
      try {
        this.filterParameters = await getFiltersParemeters(useAuthStore().accessToken ?? '');
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'An error occurred while fetching filter parameters';
      } finally {
        this.loading = false;
      }
    },

    setProjects(projects: Project[]) {
      this.projects = projects;
    },

    clearError() {
      this.error = null;
    },

    clearEverything() {
      this.projects = [];
      this.currentProject = null;
      this.loading = false;
      this.error = null;
    },
  },

  getters: {
    getProjectById: (state) => {
      return (id: string) => state.projects.find(project => project._id === id);
    },
  },
});