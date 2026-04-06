#include <iostream>
using namespace std;

int main(){
    int n, pow,num;
    cout<<"Enter the number and its power: ";
    cin>>n>>pow;
    num = n;
    for(int i=1; i<pow; i++){
        num = num * n;
    }
    cout<<"Result: "<<num<<endl;
}