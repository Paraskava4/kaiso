"use client";
import React from 'react';
import BlogHeader from './BlogHeader';
import BlogList from './BlogList';

const Blog = ({ blogsData, isLoading }) => {
  return (
    <section className="blog-section">
      <BlogHeader />
      <BlogList blogsData={blogsData} isLoading={isLoading} />
    </section>
  );
};

export default Blog;
