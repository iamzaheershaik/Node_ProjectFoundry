#include <iostream>
using namespace std;

int main(){
    int row, col;
    int n;
    cout<<"Enter the Value of n = "<<endl;
    cin>>n;

    for(row =1 ; row <=n; row++){
        for(col=1; col<=n-row; col++){
            cout<<" ";
        }
        for(col =1; col<=row; col++){
            cout<<row;
        }
        cout<<endl;
    }
}

/* 
Expected OutPut
    1
   22
  333
 4444
55555
*/