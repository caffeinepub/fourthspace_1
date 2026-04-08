// Channel message draft persistence — localStorage backed, workspace-scoped

const PREFIX = "fourthspace_chat_draft_";

export function saveDraft(channelId: string, content: string): void {
  if (content.trim()) {
    localStorage.setItem(`${PREFIX}${channelId}`, content);
  } else {
    localStorage.removeItem(`${PREFIX}${channelId}`);
  }
}

export function getDraft(channelId: string): string {
  return localStorage.getItem(`${PREFIX}${channelId}`) ?? "";
}

export function clearDraft(channelId: string): void {
  localStorage.removeItem(`${PREFIX}${channelId}`);
}
