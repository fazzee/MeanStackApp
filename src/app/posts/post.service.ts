import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + "posts/";
@Injectable({providedIn : 'root'})
export class PostService{
  private posts: Post[] = [];
  private postUpdated = new Subject<{post: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router){}



  getPosts(postsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPosts: number}>(BACKEND_URL + queryParams)
    .pipe(map((postData) => {
      return {posts: postData.posts.map(post => {
          return{
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath,
            creater: post.creater
          };
      }),
    maxPosts: postData.maxPosts};
    }))
    .subscribe((transformedPostsData)=>{
      this.posts = transformedPostsData.posts;
      this.postUpdated.next({post: [...this.posts], postCount: transformedPostsData.maxPosts});
    });

  }

  getPost(id: string){
    return this.http.get<{
      _id: string;
       title: string;
        content: string;
         imagePath: string;
          creater: string;}>(BACKEND_URL + id);
  }

  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }

  addPosts(title: string, content: string, image: File){
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message: string, post: Post}>(BACKEND_URL, postData)
    .subscribe(responseData=>{
      this.router.navigate(['/']);
    });
  }

  updatePost(id: string, title: string, content: string, image: string | File){
    let postData;
// tslint:disable-next-line: align
   if(typeof(image == "Object")){
    postData = new FormData;
    postData.append("id", id);
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
   } else {
      postData = {
      id:id,
      title: title,
      content: content,
      imagePath: image,
      creater: null
     };
   }
    this.http.put(BACKEND_URL + id, postData)
    .subscribe(response => {
      this.router.navigate(['/']);
    });

  }


  deletePost(postId: string){
    return this.http.delete(BACKEND_URL + postId);
  }

}

