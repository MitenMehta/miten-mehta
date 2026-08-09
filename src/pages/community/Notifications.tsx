import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";

export default function Notifications() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch pending requests
    const { data: requests, isLoading } = useQuery({
        queryKey: ['connection-requests'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('connection_requests')
                .select(`
          id,
          created_at,
          requester:requester_id (
            id,
            full_name,
            headline,
            avatar_url
          )
        `)
                .eq('receiver_id', user?.id)
                .eq('status', 'pending');

            if (error) throw error;
            return data;
        },
        enabled: !!user,
    });

    const updateStatusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: 'accepted' | 'rejected' }) => {
            const { error } = await supabase
                .from('connection_requests')
                .update({ status })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['connection-requests'] });
            // Also invalidate members connections if needed, though this is a separate page
            queryClient.invalidateQueries({ queryKey: ['community-members'] });
            toast.success("Request updated");
        },
        onError: (err: any) => {
            toast.error(err.message);
        }
    });

    if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container py-10 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Notifications</h1>

            {requests?.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">No pending connection requests.</p>
            ) : (
                <div className="space-y-4">
                    {requests?.map((req: any) => (
                        <Card key={req.id}>
                            <CardContent className="flex items-center justify-between p-6">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={req.requester.avatar_url} />
                                        <AvatarFallback>{req.requester.full_name?.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">{req.requester.full_name}</h3>
                                        <p className="text-sm text-muted-foreground">{req.requester.headline}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Sent {new Date(req.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'rejected' })}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => updateStatusMutation.mutate({ id: req.id, status: 'accepted' })}
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
