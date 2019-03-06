import { mimeType } from './mime-type.validator';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Form, Validators } from '@angular/forms';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';




@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
   post: Post;
   private mode = 'create';
   private postId: string;
   isLoading = false;
   form: FormGroup;
   imagePreview: string;




  constructor(public postService: PostService, public route: ActivatedRoute){}


  ngOnInit(){
    this.form = new FormGroup({
      title: new FormControl(null,
        {validators : [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null,
        {validators : [Validators.required]
      }),
      image: new FormControl(null,
        {validators : [Validators.required],
        asyncValidators: [mimeType]
      })
    });



    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
         this.mode = 'edit';
         this.postId = paramMap.get('postId');
         this.isLoading = true;
         this.postService.getPost(this.postId).subscribe(postData =>{
           this.isLoading = false;
           this.post = {
             id: postData._id,
              title: postData.title,
               content: postData.content,
                imagePath: postData.imagePath,
                 creater: postData.creater};
           this.form.setValue({
             title: this.post.title,
             content: this.post.title,
             image: this.post.imagePath
           })
         });
      }
      else {
        this.mode = 'create';
        this.postId = null;
      }
    });

  }

  onSavePost(){
    if(this.form.invalid){
      return;
    }
    if(this.mode === "create"){
      this.postService.addPosts(this.form.value.title, this.form.value.content, this.form.value.image);
    }
    else{
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }



   this.form.reset();
}

onImageUpload(event: Event){

  const file = (event.target as HTMLInputElement).files[0];
  this.form.patchValue({image: file});
  this.form.get('image').updateValueAndValidity();

  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result.toString();
  };
  reader.readAsDataURL(file);

 }
}
