#include <iostream>
using namespace std;

int main(){
    int n;
    cout<<"Enter the Value of n : ";
    cin>>n;
    for(int i=1; i<=n; i++){
        for(int j=1; j<=(5-i); j++){
            cout<<"  ";
        }
        for(int k=1; k>=((2*i)-1); k++){
            cout<<"* ";
        }
        cout<<endl;
    }
}