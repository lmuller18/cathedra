import Link from "next/link";
import { Home, Twitch, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

import { cn } from "~/lib/utils";
import NavLink from "~/components/ui/nav-link";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "~/components/ui/dropdown-menu";

const Nav = () => (
  <div className="border-b">
    <div className="flex h-16 items-center px-4">
      <NavItems />
      <div className="ml-auto flex items-center space-x-4">
        <UserMenu />
      </div>
    </div>
  </div>
);

const NavItems = () => (
  <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
    <Link href="/">
      <Home
        height={16}
        width={16}
        className="-mr-2 transition-colors hover:text-primary"
      />
    </Link>
    <NavLink
      href="/collection"
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive && "text-muted-foreground"
        )
      }
    >
      Collection
    </NavLink>
    <NavLink
      href="/backlog"
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive && "text-muted-foreground"
        )
      }
    >
      Backlog
    </NavLink>
    {/* <NavLink
      href="/examples/dashboard"
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive && "text-muted-foreground"
        )
      }
    >
      Products
    </NavLink>
    <NavLink
      href="/examples/dashboard"
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors hover:text-primary",
          !isActive && "text-muted-foreground"
        )
      }
    >
      Settings
    </NavLink> */}
  </nav>
);

const UserMenu = () => {
  const { data: session, status } = useSession();
  if (status === "loading")
    return (
      <Avatar>
        <Skeleton className="h-full w-full" />
      </Avatar>
    );

  if (!session)
    return (
      <Button onClick={() => void signIn("twitch")} variant="twitch">
        <Twitch className="mr-2 h-4 w-4" />
        Login with Twitch
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {session.user.image && (
              <AvatarImage src={session.user.image} alt={session.user.name} />
            )}
            <AvatarFallback>{session.user.name.slice(1)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={() => void signOut({ callbackUrl: "/" })}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Nav;
