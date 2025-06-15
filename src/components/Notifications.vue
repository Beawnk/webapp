<template>
	<div class="alert-container">
		<transition name="alert" mode="out-in">
	  		<div v-if="successes.length" class="success alert">
				<p v-for="(success, index) in successes" :key="'success-' + index">{{ success }}</p>
	  		</div>
		</transition>
		<transition name="alert" mode="out-in">
	  		<div v-if="errors.length" class="error alert">
				<p v-for="(error, index) in errors" :key="'error-' + index">{{ error }}</p>
	  		</div>
		</transition>
	</div>
</template>
  
<script setup>
const props = defineProps({
  	errors: Array,
  	successes: Array,
});
</script>

<style lang="scss" scoped>
.alert-container {
  	position: fixed;
  	top: 40px;
  	right: 50%;
	transform: translateX(50%);
  	z-index: 2000;
  	max-width: 500px;
	width: 80%;
	.alert {
		color: var(--white-color);
		padding: 10px 40px 10px 10px;
		border-radius: 30px;
		margin-bottom: 10px;
		background-size: 20px;
		display: flex;
  		flex-direction: column;
		align-items: center;
		gap: 5px;
		width: 100%;
		position: relative;

		&:after {
			content: '';
			display: block;
			width: 20px;
			height: 20px;
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center;
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
		}
		
		&:last-child {
			margin-bottom: 0;
		}
		
		&.success {
			background-color: var(--success-color);
			&:after {
				background-image: url('@/assets/images/icons/check-mark.png');
				background-size: 15px;
			}
		}

		&.error {
			background-color: var(--error-color);
			&:after {
				background-image: url('@/assets/images/icons/alert.png');
			}
		}
	}
}

.alert-enter-active, .alert-leave-active {
	transition: all 0.5s;
}

.alert-enter-from, .alert-leave-to {
	opacity: 0;
	transform: translateY(-1000px);
}

.alert-enter-to, .alert-leave-from {
	opacity: 1;
	transform: translateY(0);
}

</style>