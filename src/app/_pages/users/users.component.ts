import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from './users.service'; 
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, HttpClientModule, MatFormFieldModule, MatInputModule, MatIconModule, MatTableModule, MatSelectModule],
  providers:[UsersService],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],

})
export class UsersComponent {
  dataSource = <IUser[]>[];
  columnsToDisplay = ['id','firstName', 'lastName', 'maidenName', 'age', 'gender' ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: IUser | null = <IUser>{};
  ngUnSubscribe = new Subject();
  userForm:FormGroup;
  existingUserData:IUser = <IUser>{}
  loading = false;

  constructor(private userService:UsersService, private fb:FormBuilder) {
    this.userForm = this.fb.group({
      id:[''],
      firstName:[''],
      lastName: [''], 
      maidenName:[''], 
      age:['', Validators.pattern(/^[0-9]\d*$/)],
      gender: [''], 
      
    });
  }

  ngOnInit() {
    this.userService.getUsersList().pipe(takeUntil(this.ngUnSubscribe)).subscribe(data=>{
      this.dataSource = data.users;
      console.log(this.dataSource)
    })
  }

  editForm(element:IUser) {
    this.loading = false;
    this.existingUserData = element;
    this.userForm.patchValue({
      id:element.id,
      firstName:element.firstName,
      lastName:element.lastName,
      age:element.age,
      gender:element.gender,
      maidenName:element.maidenName,
    })
  }

  SaveUser() {
    this.loading = true;
    this.existingUserData.firstName = this.userForm.value.firstName;
    this.existingUserData.lastName = this.userForm.value.lastName;
    this.existingUserData.maidenName = this.userForm.value.maidenName;
    this.existingUserData.age = this.userForm.value.age;
    this.existingUserData.gender = this.userForm.value.gender;
    this.userService.putUserData(this.existingUserData).pipe(takeUntil(this.ngUnSubscribe)).subscribe(data=>{})
    const index = this.dataSource.findIndex(e=>e.id== this.userForm.value.id);
    setTimeout(()=>{
      this.dataSource[index] = this.existingUserData;
      this.loading = false;
    }, 1000);
  }

  ngOnDestroy() {
    this.ngUnSubscribe.next(0);
    this.ngUnSubscribe.complete();
  }
}

export interface IUserList {
  users:IUser[],
  limit:number,
  total:number,
  skip:number,
}

export interface IUser {
  id?: number;
  firstName?: string;
  lastName?: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email?:string,
  phone?:string,
  username?:string,
  password?:string,
  birthDate?:Date,
  image?:string,
  bloodGroup?:string,
  height?:number,
  weight?:number,
  eyeColor?:string,
  hair?:{
    color?:string,
    type?:string
  },
  domain?:string,
  ip?:string,
  address?:{
    address?:string,
    city?:string,
    coordinates?:{
      lat?:number,
      lng?:number
    },
    postalCode?:string,
    state?:string
  },
  macAddress?:string,
  university?:string,
  bank?:{
    cardExpire?:string,
    cardNumber?:string,
    cardType?:string,
    currency?:string,
    iban?:string
  },
  company?:{
    address?:{
      address?:string,
      city?:string,
      coordinates?:{
        lat?:number,
        lng?:number
      },
      postalCode?:string,
      state?:string
    },
    department?:string,
    name?:string,
    title?:string
  },
  ein?:string,
  ssn?:string,
  userAgent?:string
}

