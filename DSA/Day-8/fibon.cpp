#include <iostream>
using namespace std;

int main(){
    int last = 0, prev = 1, next;
    next = last + prev;
    for( int i = last; i<10; i++){
        cout<<next<<" ";
        last = prev;
        prev = next;
        next  = last + prev;
    }
    return 0;
}