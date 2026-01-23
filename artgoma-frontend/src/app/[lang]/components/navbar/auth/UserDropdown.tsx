"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, ActivitySquare, LogIn, LogOut, PartyPopper, QrCodeIcon, Settings2, Ticket } from "lucide-react";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const UserDropdown = ({ session }: { session: Session }) => {
  const initials = session?.user?.name?.slice(0, 3).toUpperCase();

  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="mx-6 text-white border border-red-600 bg-black/60 backdrop-blur-sm rounded-full">
          <Avatar>
            <AvatarImage
              sizes="sm"
              src={session?.user?.image ?? `https://avatar.vercel.sh/${session?.user?.name}.svg?text=${initials}`}
              alt="avatar user"
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black/80 backdrop-blur-sm border-red-600">
          <DropdownMenuLabel className="text-white">{session.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              hidden={session?.user?.badge !== "admin" ? true : false}
              className="text-white hover:font-semibold flex justify-between"
            >
              <Link href={"/visits"}>Visits</Link>
              <Ticket />
            </DropdownMenuItem>
            <DropdownMenuItem
              hidden={session?.user?.badge !== "admin" ? true : false}
              className="text-white hover:font-semibold flex justify-between"
            >
              <Link href={"/events"}>Events</Link>
              <PartyPopper />
            </DropdownMenuItem>
            <DropdownMenuItem
              hidden={session?.user?.badge !== "admin" ? true : false}
              className="text-white hover:font-semibold flex justify-between"
            >
              <Link href={"/events-panel"}>Events Panel</Link>
              <Settings2 />
            </DropdownMenuItem>
            <DropdownMenuItem
              hidden={session?.user?.badge !== "admin" ? true : false}
              className="text-white hover:font-semibold flex justify-between"
            >
              <Link href={"/generate-qr"}>Qr-Generator</Link>
              <QrCodeIcon />
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:font-semibold">
              <button className="w-full flex justify-between" type="button" onClick={() => signOut()}>
                Logout
                <LogOut className="h-4 w-4" />
              </button>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else {
    return (
      <Link
        href={"/login"}
        className="flex justify-between items-center gap-2 bg-black/70 hover:bg-white/20 border-2 border-red-700 text-white rounded-full p-2"
      >
        <span className="text-md">Login</span> <LogIn className="h-4 w-4" />
      </Link>
    );
  }
};

export default UserDropdown;
