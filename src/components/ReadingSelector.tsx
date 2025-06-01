
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Stars, Sparkles, User } from "lucide-react";
import PersonalizedReading from "./PersonalizedReading";
import TarotReading from "./TarotReading";

interface ReadingSelectorProps {
  userProfile: {
    fullName: string;
    birthDate: string;
    birthPlace: string;
  };
}

const ReadingSelector = ({ userProfile }: ReadingSelectorProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-400/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            <Stars className="h-6 w-6 text-yellow-400" />
            Choose Your Reading Type
          </CardTitle>
          <p className="text-purple-200">
            Select the type of cosmic guidance you'd like to receive
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="personalized" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-purple-900/30 border border-purple-400/30">
          <TabsTrigger 
            value="personalized" 
            className="data-[state=active]:bg-purple-700/50 data-[state=active]:text-white text-purple-200"
          >
            <User className="mr-2 h-4 w-4" />
            Personal Reading
          </TabsTrigger>
          <TabsTrigger 
            value="tarot" 
            className="data-[state=active]:bg-purple-700/50 data-[state=active]:text-white text-purple-200"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Tarot Reading
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personalized" className="mt-6">
          <PersonalizedReading userProfile={userProfile} />
        </TabsContent>
        
        <TabsContent value="tarot" className="mt-6">
          <TarotReading userProfile={userProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReadingSelector;
