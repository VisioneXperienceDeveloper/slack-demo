import ChatView from '@/features/chat/ChatView';

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ workspaceId: string; channelId: string }>;
}) {
  const resolvedParams = await params;
  return <ChatView workspaceId={resolvedParams.workspaceId} channelId={resolvedParams.channelId} />;
}
