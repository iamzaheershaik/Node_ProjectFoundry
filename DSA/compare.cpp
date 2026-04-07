//
// Created by other on 4/7/2026.
//

#include<iostream>
using namespace std;

int main(){
    int n;
    cout<<"Enter the Number n"<<endl;
    cin>>n;
    for(int i=1; i<=n; i++){
        for(int j=1; j<=n-i; j++){
            cout<<"  ";
        }
        for(char j='a'; j<='a'+i-1; j++){
            cout<<j<<" ";
        }
        cout<<endl;
    }
}
