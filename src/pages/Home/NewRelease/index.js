import { Center, HStack, IconButton, Skeleton, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { GoPrimitiveDot } from 'react-icons/go';
import ReleaseCard from './ReleaseCard';
import ReleaseHeader from './ReleaseHeader';
import useAPIrequest from '../../../adapters/useAPIrequest';


const NewRelease = () => {

    const { response, error } = useAPIrequest('https://yts.mx/api/v2/list_movies.json?sort_by=year');

    const [isLoading, setIsLoading] = useState(true);

    const arr = [
        { show: true },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
    ];

    const [page, setPage] = useState(1);
    const [slides, setSlides] = useState(arr);

    const handlePageChange = (dir) => {
        if (dir === +1) {
            page === 6 ? setPage(1) : setPage(page + 1);
        } else {
            page === 1 ? setPage(6) : setPage(page - 1);
        }
    };

    useEffect(() => {
        if (response && response !== null) {
            arr.map((item, index) => {
                return [
                    item.img = response.data.movies[index]['background_image_original'],
                    item.title = response.data.movies[index]['title_long']
                ];
            });

            arr.map(item => {
                return (item.show = false);
            });
            arr[page - 1].show = true;
            setSlides(arr);
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [response, page]);

    return (
        <VStack>
            <ReleaseHeader />
            <Skeleton rounded='xl' isLoaded={!isLoading} w='full'>
                <Center overflow='hidden' w='full' pos='relative'>

                    {slides.map((item, key) => {
                        return (
                            <ReleaseCard
                                show={item.show}
                                key={key}
                                isLoading={isLoading}
                                img={item.img}
                                title={item.title} />
                        );
                    }
                    )}

                    <HStack spacing={0} pos='absolute' bottom={3}>
                        {[...Array(6)].map((e, i) => <GoPrimitiveDot key={i} opacity={i + 1 === page ? 1 : 0.3} />)}
                    </HStack>
                    <IconButton
                        pos='absolute'
                        left={3}
                        onClick={() => handlePageChange(-1)}
                        size='sm'
                        icon={<FaArrowLeft />} />
                    <IconButton
                        pos='absolute'
                        right={3}
                        onClick={() => handlePageChange(+1)}
                        size='sm'
                        icon={<FaArrowRight />} />
                </Center>
            </Skeleton>
        </VStack>
    );

};
export default NewRelease;
