import { GetStaticProps } from "next";
import Head from "next/head";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typiings";

interface Props {
	post: Post;
}

function Post({ post }: Props) {
	return (
		<>
			<Head>
				<title>Blog Medium | {post.title}</title>
			</Head>
			<main>
				<Header />
			</main>
		</>
	);
}

export default Post;

export const getStaticPaths = async () => {
	const query = `*[_type == "post"]{
            _id, 
            slug{
                current
            }
        }`;

	const posts = await sanityClient.fetch(query);

	const paths = posts.map((post: Post) => ({
		params: {
			slug: post.slug.current,
		},
	}));

	return {
		paths,
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createAt,
        title,
        author->{
            name, 
            image
        },

        'comments': *[
            _type == "comment" && 
            post._ref == ^.id &&
            approved == true],

        description,
        mainImage,
        slug,
        body}`;

	const post = await sanityClient.fetch(query, {
		slug: params?.slug,
	});

	if (!post) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			post,
		},
		revalidate: 60, // after 60 seconds, itll update the old cached version
	};
};
