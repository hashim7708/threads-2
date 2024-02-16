"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/Validationns/user";
import z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}
interface UploadResponse {
  message: string;
  imageUrl: string;
}
const AccountProfile = ({ user, btnTitle }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [deployedImage, setDeployedImage] = useState<string>("");
  const [imageChanged, setImageChanged] = useState<boolean>(false);
  const [imagehasChanged, setImagehasChanged] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });
  // form submmission
  async function onSubmit(values: z.infer<typeof UserValidation>) {
    if (imagehasChanged) {
      values.profile_photo = deployedImage;
    } else {
      values.profile_photo = user.image;
    }
    const response = await axios.post("api/user", {
      values,
      id: user.id,
      pathname,
    });
    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  }

  // image to aws
  const handleImage = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    setImageChanged(true);

    const filereader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      try {
        // Create FormData and append the selected image file
        const formData = new FormData();
        formData.append("image", e.target.files[0]);

        // Upload the image using axios
        await axios
          .post<UploadResponse>("/api/upload-image", formData)
          .then((res) => {
            if (res.data.message === "success") {
              setDeployedImage(res.data.imageUrl);
            }

            console.log(res);
          });
      } catch (error) {
        console.error("Error uploading image:", error);
        // Handle error appropriately (e.g., show an error message to the user)
      } finally {
        setImagehasChanged(true);
        setImageChanged(false);
      }

      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      // Check if the file is an image
      filereader.onload = (event) => {
        const imgDataUrl = event.target?.result?.toString() || "";
        fieldChange(imgDataUrl);
        console.log("imgDataUrl", imgDataUrl);
      };

      filereader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Add profile photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="text-base-semibold text-light-2">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={imageChanged}
          className="bg-primary-500"
        >
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
