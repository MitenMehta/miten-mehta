import { FileText, Home, LogOut, Code, Users, Linkedin } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/use-auth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const items = [
  { title: 'Leads CRM', url: '/admin/leads', icon: Users },
  { title: 'Articles', url: '/admin', icon: FileText },
  { title: 'LinkedIn Posts', url: '/admin/linkedin-posts', icon: Linkedin },
  { title: 'Tracking Codes', url: '/admin/tracking-codes', icon: Code },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const { signOut, user } = useAuth();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    className="hover:bg-muted/50"
                    activeClassName="bg-muted text-primary font-medium"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    {!isCollapsed && <span>Public Site</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && (
          <div className="mt-auto p-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Sign Out</span>}
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}