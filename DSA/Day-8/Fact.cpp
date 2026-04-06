#include <iostream>
using namespace std;

int main(){
    long int n, fact=1;
    cout<<"Enter the Number"<<endl;
    cin>>n;

    for(long 
        int i=1; i<=n; i++){
        fact = fact*i;
    }
    cout<<"the Factorial of the n numbers = "<<fact;
}