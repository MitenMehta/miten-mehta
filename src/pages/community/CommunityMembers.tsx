import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2, UserPlus, Check, Clock } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

type MemberProfile = {
    id: string;
    user_id: string;
    full_name: string | null;
    headline: string | null;
    avatar_url: string | null;
    linkedin_id: string | null;
};

export default function CommunityMembers() {
    const { slug } = useParams();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // 1. Fetch Community Details
    const { data: community } = useQuery({
        queryKey: ['community', slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('communities')
                .select('*')
                .eq('slug', slug)
                .single();
            if (error) throw error;
            return data;
        },
        enabled: !!slug,
    });

    // 2. Fetch Members & Connection Status
    const { data: members, isLoading } = useQuery({
        queryKey: ['community-members', community?.id],
        queryFn: async () => {
            // Get members
            const { data: memberData, error: memberError } = await supabase
                .from('community_members')
                .select('user_id')
                .eq('community_id', community?.id);

            if (memberError) throw memberError;

            const memberIds = memberData.map((member) => member.user_id);
            const { data: profiles, error: profileError } = memberIds.length
                ? await supabase
                    .from('profiles')
                    .select('id, user_id, full_name, headline, avatar_url, linkedin_id')
                    .in('user_id', memberIds)
                : { data: [], error: null };

            if (profileError) throw profileError;
            const profilesByUserId = new Map(
                (profiles as MemberProfile[]).map((profile) => [profile.user_id, profile]),
            );

            // Get connection requests involving current user
            const { data: requests, error: reqError } = await supabase
                .from('connection_requests')
                .select('*')
                .or(`requester_id.eq.${user?.id},receiver_id.eq.${user?.id}`);

            if (reqError) throw reqError;

            // Merge data
            return memberData.flatMap((item) => {
                const profile = profilesByUserId.get(item.user_id);
                if (!profile) return [];
                // Find request status
                const request = requests?.find(
                    r => (r.requester_id === user?.id && r.receiver_id === profile.user_id) ||
                        (r.receiver_id === user?.id && r.requester_id === profile.user_id)
                );

                let connectionStatus = 'none'; // none, pending, accepted, sent
                if (request) {
                    if (request.status === 'accepted') connectionStatus = 'accepted';
                    else if (request.requester_id === user?.id) connectionStatus = 'sent';
                    else connectionStatus = 'pending'; // Received
                }

                return {
                    ...profile,
                    id: profile.user_id,
                    connectionStatus,
                    requestId: request?.id
                };
            });
        },
        enabled: !!community?.id && !!user,
    });

    // Mutation to send request
    const sendRequestMutation = useMutation({
        mutationFn: async (receiverId: string) => {
            const { error } = await supabase
                .from('connection_requests')
                .insert({
                    requester_id: user?.id,
                    receiver_id: receiverId,
                });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community-members'] });
            toast.success("Connection request sent!");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Unable to send connection request"));
        }
    });

    // Mutation to accept request (if needed here, or handle in notifications)
    // For now, simple "Send Request" logic.

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">{community?.name} Community</h1>
                <p className="text-muted-foreground">Connect with professionals in this space.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members?.map((member) => (
                    <Card key={member.id} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={member.avatar_url} />
                                <AvatarFallback>{member.full_name?.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold text-lg leading-none">{member.full_name}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{member.headline}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-2 flex justify-end">
                                {member.id === user?.id ? (
                                    <Button variant="secondary" size="sm" disabled>You</Button>
                                ) : (
                                    <>
                                        {member.connectionStatus === 'none' && (
                                            <Button size="sm" onClick={() => sendRequestMutation.mutate(member.id)} variant="outline">
                                                <UserPlus className="mr-2 h-4 w-4" /> Connect
                                            </Button>
                                        )}
                                        {member.connectionStatus === 'sent' && (
                                            <Button size="sm" variant="secondary" disabled>
                                                <Clock className="mr-2 h-4 w-4" /> Pending
                                            </Button>
                                        )}
                                        {member.connectionStatus === 'accepted' && (
                                            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                                                <Check className="mr-2 h-4 w-4" /> Connected
                                            </Button>
                                        )}
                                        {member.connectionStatus === 'pending' && (
                                            <Button size="sm" variant="secondary" disabled>
                                                Request Received
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
