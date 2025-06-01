
import React from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Calendar } from "lucide-react";

interface UserProfileData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

interface UserProfileFormProps {
  onSubmit: (data: UserProfileData) => void;
  isLoading?: boolean;
}

const UserProfileForm = ({ onSubmit, isLoading = false }: UserProfileFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<UserProfileData>();

  const onFormSubmit = (data: UserProfileData) => {
    // Combine date and time for the full birth datetime
    const fullBirthDateTime = `${data.birthDate} at ${data.birthTime}`;
    onSubmit({
      ...data,
      birthDate: fullBirthDateTime
    });
  };

  return (
    <Card className="bg-purple-900/30 border-purple-400/30 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5 text-purple-400" />
          Personal Information for Your Reading
        </CardTitle>
        <p className="text-purple-200 text-sm">
          To provide you with the most accurate and personalized tarot reading, please share your birth details.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-white">Full Name</Label>
            <Input
              id="fullName"
              {...register("fullName", { required: "Full name is required" })}
              placeholder="Enter your full name"
              className="bg-purple-800/20 border-purple-400/50 text-white placeholder:text-purple-300"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-white flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Date of Birth
            </Label>
            <Input
              id="birthDate"
              type="date"
              {...register("birthDate", { required: "Birth date is required" })}
              className="bg-purple-800/20 border-purple-400/50 text-white"
            />
            {errors.birthDate && (
              <p className="text-red-400 text-sm">{errors.birthDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthTime" className="text-white">Time of Birth</Label>
            <Input
              id="birthTime"
              type="time"
              {...register("birthTime", { required: "Birth time is required" })}
              className="bg-purple-800/20 border-purple-400/50 text-white"
            />
            {errors.birthTime && (
              <p className="text-red-400 text-sm">{errors.birthTime.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthPlace" className="text-white flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Place of Birth
            </Label>
            <Input
              id="birthPlace"
              {...register("birthPlace", { required: "Birth place is required" })}
              placeholder="City, Country"
              className="bg-purple-800/20 border-purple-400/50 text-white placeholder:text-purple-300"
            />
            {errors.birthPlace && (
              <p className="text-red-400 text-sm">{errors.birthPlace.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            {isLoading ? "Generating Your Reading..." : "Generate Personal Reading"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfileForm;
