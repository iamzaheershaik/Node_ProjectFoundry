#include <iostream>
using namespace std;

int main(){
    int n, sum;
    
    cout<<"Enter a number: ";
    cin>>n;
    // for(int i=1; i<=n; i++){
    //     sum = sum + i;
    // }
    // cout<<"Sum of first "<<n<<" natural numbers is: "<<sum<<endl;
    // sum  = (n*(n+1))/2;
    // cout<<"Sum of first "<<n<<" natural numbers is: "<<sum<<endl;

// for the sum of squares of first n natural numbers

    for(int i=1; i<=n; i++){
        sum = sum + (i * i);
    }
    cout<<"Sum of first "<<n<<" natural numbers is: "<<sum<<endl;
}
