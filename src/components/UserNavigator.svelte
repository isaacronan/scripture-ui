<script>
import { dashboardHash, homeHash } from '../utils/routing';

export let isUserScreen = false;
</script>
<nav class:user={isUserScreen}>
    <div class="user-navigator">
        <a class="plain-button" href={isUserScreen ? homeHash : dashboardHash}>
            {isUserScreen ? 'Home' : 'Dashboard'}
        </a>
        <div class="logout">
            <button class="plain-button">
                Log Out
                <i class="fas fa-sign-out-alt" />
            </button>
        </div>
    </div>
</nav>
<style>
.user-navigator {
    background-color: var(--dark);
    display: flex;
    height: var(--lh-normal);
    padding: var(--spacing-md);
}

.user .user-navigator {
    background-color: var(--beige);
}

i {
    padding-right: var(--spacing-sm);
}

.logout i {
    padding-left: var(--spacing-sm);
    padding-right: 0;
}

.logout {
    flex-grow: 1;
    text-align: right;
}

a,
button {
    color: var(--white);
}

.user a,
.user button {
    color: var(--dark);
}
</style>