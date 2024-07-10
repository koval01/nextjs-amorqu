import { useEffect, useState } from 'react';

import { ProfileDetails, ProfilePicture } from '@/api';
import formatDate from '@/helpers/date';

import { Card, CardScroll, Group, Header, Skeleton, Image } from '@vkontakte/vkui';

import { useTranslation } from 'react-i18next';
import { i18n, TFunction } from 'i18next';

interface GalleryProps {
    pictures: ProfilePicture[] | undefined
    profile: ProfileDetails | undefined
}

interface GalleryMapProps {
    pictures: ProfilePicture[] | undefined
    i18n: i18n
    t: TFunction<"translation", undefined>
}

const GalleryMap = ({ pictures, i18n, t }: GalleryMapProps) => {
    if (!pictures?.length) {
        return null;
    }

    return (
        pictures
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((pic, index) =>
            (
                <Card key={index} className="rounded-xl">
                    <Image
                        src={pic.url} alt={t("Users's image")}
                        className="!rounded-xl"
                        style={{
                            height: "18rem",
                            width: "auto"
                        }}
                    />
                    <div className="absolute bottom-0">
                        <div className="vkuiContentBadge--primary-accent p-1 rounded-tr-lg rounded-bl-xl">
                            <p className="vkuiTypography--weight-2 ml-1 pr-1 text-sm first-letter:uppercase">
                                {formatDate(pic.createdAt / 1e3, i18n)}
                            </p>
                        </div>
                    </div>
                </Card>
            ))
    );
}

const Gallery = ({ pictures, profile }: GalleryProps) => {
    const { t, i18n } = useTranslation();

    const [picturesAvailability, setPicturesAvailability] = useState<boolean>(true);

    useEffect(() => {
        if (pictures && !pictures?.length)
            setPicturesAvailability(false);
        else
            setPicturesAvailability(true);
    }, [pictures]);

    return (
        picturesAvailability ? (
            <Group header={<Header>{!profile ? <Skeleton width={105} /> : t("Users's gallery")}</Header>}>
                {!profile ? (<Skeleton height={288} className="rounded-xl" />) : (
                    <CardScroll size="m">
                        <GalleryMap
                            pictures={pictures}
                            i18n={i18n}
                            t={t} />
                    </CardScroll>)
                }
            </Group>
        ) : null
    )
}

export default Gallery;
