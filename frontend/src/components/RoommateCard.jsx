import { MapPin, DollarSign } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom"; // <-- IMPORT
import axios from "../api/axiosInstance"; // <-- IMPORT
import { useAuth } from "../context/AuthContext"; // <-- IMPORT

const defaultAvatar = "https://i.imgur.com/6VBx3io.png";

const RoommateCard = ({
  userId, // <-- GET THE NEW PROP
  name,
  age,
  occupation,
  location,
  budget,
  tags,
  avatarUrl,
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartChat = async () => {
    if (!user) {
      alert("Please log in to start a chat.");
      return;
    }

    try {
      // Call the API to create or find the conversation
      const res = await axios.post("/conversations", {
        receiverId: userId,
      });
      // The API returns the conversation object. Navigate to the chat page.
      navigate(`/chat/${res.data._id}`);
    } catch (err) {
      console.error("Failed to start conversation", err);
      alert("Could not start chat.");
    }
  };

  return (
    <Card className="group hover:shadow-large transition-all duration-300 hover:-translate-y-1 border-border flex flex-col">
      <CardContent className="p-6 flex-grow">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/10">
            <AvatarImage src={avatarUrl || defaultAvatar} alt={name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">
              {name}, {age || 'N/A'}
            </h3>
            <p className="text-sm text-muted-foreground">{occupation || 'N/A'}</p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{location || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{budget ? `₹${budget}/month` : 'N/A'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags && tags.length > 0 ? (
            tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="text-xs">No tags</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleStartChat} // <-- ADD ONCLICK
          className="w-full bg-[#5b5dda] text-white hover:bg-[#4a4ab5] cursor-pointer"
        >
          Message {name.split(' ')[0]}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoommateCard;