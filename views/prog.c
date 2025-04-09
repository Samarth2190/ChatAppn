#include <stdio.h>
#include <limits.h>

int min(int x, int y, int z) {
    if (x < y)
        return (x < z) ? x : z;
    else
        return (y < z) ? y : z;
}

int main() {
    int M, N;
    scanf("%d %d", &M, &N);
    int cost[M][N], dp[M][N];
    for (int i = 0; i < M; i++)
        for (int j = 0; j < N; j++)
            scanf("%d", &cost[i][j]);

    dp[0][0] = cost[0][0];
    for (int i = 1; i < M; i++)
        dp[i][0] = dp[i - 1][0] + cost[i][0];
    for (int j = 1; j < N; j++)
        dp[0][j] = dp[0][j - 1] + cost[0][j];
    for (int i = 1; i < M; i++) {
        for (int j = 1; j < N; j++) {
            dp[i][j] = cost[i][j] + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    printf("%d\n", dp[M - 1][N - 1]);
    return 0;
}
