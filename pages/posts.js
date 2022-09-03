import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Avatar, Button } from "antd";
import Head from "next/head";
import Link from "next/link";

const { Meta } = Card;

export const Posts = ({ posts }) => {
  // state
  const [allPosts, setAllPosts] = useState(posts);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const[Likes,setLikes]=useState("");
  const[postIdd,setpostId]=useState("");
  useEffect(() => {
    getTotal();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get("/post-count");
      console.log("total", data);
      setTotal(data);
    } catch (err) {
      console.log(err);
    }
  };

  const UpdateLike = async (ee) => {
    try {
      // setpostId(ee);
      setLikes("");
       const postId=ee;
     console.log(postId)
      const { data } = await axios.post("/likes",{postId});
      console.log("total", data);
      setLikes(data.likes);
      LikeHelper();
      
    } catch (err) {
      console.log(err);
    }
  };

  const DisLike = async (ee) => {
    try {
      const postId=ee;
     console.log(postId)
      const { data } = await axios.post("/disLikes",{postId});
      console.log("total", data);
      setLikes(data.likes);
      LikeHelper();
    } catch (err) {
      console.log(err);
    }
  };


  const loadMore = async () => {
    try {
     
      setLoading(true);
      const { data } = await axios.get(`/posts/${page}`);
      setAllPosts([...allPosts, ...data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  const LikeHelper = async () => {
    try {
     
      setLoading(true);
      const { data } = await axios.get(`/posts/${page}`);
      setAllPosts([...data]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };


  return (
    <>
      <Head>
        <title>Recent blog posts</title>
        <meta description="Blog posts about web development, programming etc" />
      </Head>
      <Row gutter={12}>
        {allPosts.map((post) => (
          <Col xs={24} xl={8} style={{ marginTop: 5, marginBottom: 5 }}>
            {/* <Link href={`/post/${post.slug}`}> */}
              <a>
                <Card
                  hoverable
                  cover={
                    <Avatar
                      shape="square"
                      style={{ height: "200px" }}
                      src={post.featuredImage?.url || "images/default.jpeg"}
                      alt={post.title}
                    />
                  }
                >
                   <p>{post.likes}</p>
                    {/* if(page==1){
                      <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                    }
                    else{
                      <button onClick={()=> DisLike(post._id)}>DisLikes</button>
                    } */}
                     <button onClick={()=> UpdateLike(post._id)}>Likes</button>
                     <button onClick={()=> DisLike(post._id)}>DisLikes</button>
                </Card>
              </a>
        
        
                     {/* <button onClick={Dislike}>Dislikes</button> */}
                  <Meta title={post.title} />
          </Col>
        ))}
      </Row>

      {allPosts?.length < total && (
        <Row>
          <Col span={24} style={{ textAlign: "center", padding: 20 }}>
            <Button
              size="large"
              type="primary"
              loading={loading}
              onClick={() => setPage(page + 1)}
            >
              Load More
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/posts/1`);
  return {
    props: {
      posts: data,
    },
  };
}

export default Posts;
