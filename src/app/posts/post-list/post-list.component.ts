import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  // posts = [
  //   {title: "First Post", content: "First Post Content"},
  //   {title: "Second Post", content: "Second Post Content"},
  //   {title: "Third Post", content: "Third Post Content"}
  // ];
   totalPosts = 0;
   postsPerPage = 2;
   pageSizeOptions = [1, 2, 5, 10];
   currentPage = 1;
   posts: Post[] = [];
   private postSub: Subscription;
   isLoading = false;
   public userIsAuthenticated = false;
   private authListenerSub: Subscription;

  constructor(public postService : PostService, private authService: AuthService){

  }

  ngOnInit(){
   this.isLoading = true;
   this.postService.getPosts(this.postsPerPage, this.currentPage);
   this.postSub = this.postService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) =>{
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;

    });
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
       this.userIsAuthenticated = isAuthenticated;
    });
  }


  onChangedPage(pageData : PageEvent){
    this.isLoading = true;
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
    this.authListenerSub.unsubscribe();
  }


   onDelete(postId: string){
      this.isLoading = true;
      this.postService.deletePost(postId).subscribe(() =>{
       this.postService.getPosts(this.postsPerPage, this.currentPage);
     });
   }
}
