#include <iostream>
using namespace std;

int main(){
    int n;
    cout<<"Enter the Number N ===";
    cin>>n;
    if(n<2){
        cout<<"The Number "<<n<<"is not a Prime Number because  less than 2";
        return 0;
    }else{
        for(int i = 2; i<n; i++){
            if(n%i==0){
                cout<<"the Number is not a prime"<<endl;
                return 0;
            }
        }
        cout<<"The number "<<n<<" is prime Number "<<endl;
        return 0;
    }
}