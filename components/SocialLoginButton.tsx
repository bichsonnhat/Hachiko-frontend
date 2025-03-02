import { useSSO, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { twMerge } from 'tailwind-merge'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";

const SocialLoginButton = ({
  strategy,
}: {
  strategy: "facebook" | "google" | "apple";
}) => {
  const getStrategy = () => {
    if (strategy === "facebook") {
      return "oauth_facebook";
    } else if (strategy === "google") {
      return "oauth_google";
    } 
    return "oauth_apple";
  };

  const { startSSOFlow } = useSSO()

  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const buttonText = () => {
    if (isLoading) {
      return "Loading...";
    }

    if (strategy === "facebook") {
      return "Tiếp tục bằng Facebook";
    } else if (strategy === "google") {
      return "Tiếp tục bằng Google";
    } else if (strategy === "apple") {
      return "Tiếp tục bằng Apple";
    }
  };

  const buttonIcon = () => {
    if (strategy === "facebook") {
      return <Image source={require('@/assets/images/auth/facebook.png')} className="size-5" />;
    } else if (strategy === "google") {
      return <Image source={require('@/assets/images/auth/google.png')} className="size-5" />;
    } else if (strategy === "apple") {
      return <Image source={require('@/assets/images/auth/apple.png')} className="size-5" />;
    }
  };

  const onSocialLoginPress = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: getStrategy(),
      });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        console.log("Session created", createdSessionId);
        setActive!({ session: createdSessionId });
        await user?.reload();
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TouchableOpacity
    style={{
      backgroundColor: strategy === "facebook" ? "#1976D3" : strategy === "google" ? "#EEEEEE" : "black",
    }}
    className={twMerge(
        "py-3 rounded-md flex flex-row items-center justify-center gap-2",
        isLoading ? "opacity-50" : ""
      )}
        onPress={onSocialLoginPress}
        disabled={isLoading}
    >
        {buttonIcon()}
        <Text className={twMerge(
            strategy == "facebook" ? "text-white" : strategy == "google" ? "text-[#4285F4]" : "text-white",
            "text-center font-medium text-base"
        )}>
            {buttonText()}
        </Text>
    </TouchableOpacity>
  );
};

export default SocialLoginButton;