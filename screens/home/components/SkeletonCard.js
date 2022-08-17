import React from "react";
import { Skeleton, VStack, HStack, Center } from "native-base";

const SkeletonCard = () => {
  return (
    <VStack space="4" p={5}>
      <HStack justifyContent="space-between">
        <HStack space={2} alignItems="center">
          <Skeleton size="10" rounded="full" />
          <VStack space={2}>
            <Skeleton h="3" style={{ width: 100 }} rounded="full" />
            <Skeleton h="3" style={{ width: 50 }} rounded="full" />
          </VStack>
        </HStack>
        <Skeleton h="3" style={{ width: 30 }} rounded="full" />
      </HStack>

      <Skeleton.Text />
      <HStack space="2" alignItems="center">
        <Skeleton h="5" w="10" rounded="full" />
        <Skeleton h="5" w="10" rounded="full" />
      </HStack>
    </VStack>
  );
};

export default SkeletonCard;
