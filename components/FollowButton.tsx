'use client'

import { useState } from "react";
import { Button } from "./ui/button";
import { UserPlus, Check, Loader2 } from "lucide-react";
import { followUserAction } from "@/lib/follow-action";

interface FollowButtonProps {
  followerId: string;
  followingId: string;
  initialIsFollowing: boolean;
}

export default function FollowButton({ 
  followerId, 
  followingId, 
  initialIsFollowing 
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    // Prevent multiple clicks
    if (loading || isFollowing) return;

    setLoading(true);
    try {
      const result = await followUserAction(followerId, followingId);
      
      if (result?.error) {
        alert(result.error);
      } else {
        setIsFollowing(true);
      }
    } catch (e) {
      console.error("Follow failed:", e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleFollow} 
      disabled={loading || isFollowing}
      variant={isFollowing ? "outline" : "default"}
      className={`gap-2 transition-all duration-200 ${
        !isFollowing ? "bg-orange-500 hover:bg-orange-600 text-white" : "border-green-500 text-green-600"
      }`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isFollowing ? (
        <Check className="w-4 h-4" />
      ) : (
        <UserPlus className="w-4 h-4" />
      )}
      
      {isFollowing ? "Requested" : "Follow Owner"}
    </Button>
  );
}