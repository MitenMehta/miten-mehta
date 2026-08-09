import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Loader2, Users, Bell } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export default function CommunityDashboard() {
    const { user } = useAuth();

    // Fetch communities
    const { data: communities, isLoading: isLoadingCommunities } = useQuery({
        queryKey: ['communities'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('communities')
                .select('*');
            if (error) throw error;
            return data;
        },
    });

    // Fetch pending requests count
    const { data: requestCount } = useQuery({
        queryKey: ['pending-requests-count'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('connection_requests')
                .select('*', { count: 'exact', head: true })
                .eq('receiver_id', user?.id)
                .eq('status', 'pending');

            if (error) throw error;
            return count || 0;
        },
        enabled: !!user,
    });

    if (isLoadingCommunities) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Community Hub</h1>
                <Button variant="outline" asChild className="relative">
                    <Link to="/community/notifications">
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                        {requestCount && requestCount > 0 ? (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                {requestCount}
                            </span>
                        ) : null}
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {communities?.map((community) => (
                    <Link key={community.id} to={`/community/${community.slug}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {community.name}
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{community.name}</div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Join the conversation
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
