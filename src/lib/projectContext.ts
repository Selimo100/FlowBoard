export function setActiveProject(projectId: string) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('activeProjectId', projectId);
    // Dispath event so components can react immediately if needed
    window.dispatchEvent(new Event('projectChanged'));
  }
  // Also set a cookie for server-side awareness if needed, 
  // though for now client-side is enough for the UI switcher state.
  document.cookie = `activeProjectId=${projectId}; path=/; max-age=31536000`;
}

export function getActiveProject(): string | null {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('activeProjectId');
  }
  return null;
}
