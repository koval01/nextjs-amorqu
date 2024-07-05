import { SimpleCell, Skeleton as VKSkeleton } from "@vkontakte/vkui";

const Skeleton = ({ count }: { count: number }) => (
    [...Array(count)].map((_, i) => (
        <SimpleCell
            key={i}
            before={<VKSkeleton width={28} height={28} borderRadius="15%" />}
            after={<VKSkeleton width={72} />}
        >
            <VKSkeleton width={120} />
        </SimpleCell>
    ))
)

export default Skeleton;
